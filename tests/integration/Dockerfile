FROM registry.access.redhat.com/ubi9/ubi-minimal:latest

ARG GO_VERSION
ENV GOPATH=/go
ENV PATH=/usr/local/go/bin:$GOPATH/bin:$PATH
# we need to set HOME when running on OCP with random UID, otherwise the home is set to / and any writing there will fail with permission denied
ENV HOME=$GOPATH/src/kiali

# install required packages and prepare go dirs
WORKDIR /bin
RUN microdnf install -y --nodocs tar gzip make which gettext git findutils\
    && curl -Lo ./oc.tar.gz https://mirror.openshift.com/pub/openshift-v4/clients/ocp/stable/openshift-client-linux.tar.gz \
    && tar -xf oc.tar.gz \
    && rm -f oc.tar.gz \
    && curl -Lo ./golang.tar.gz https://go.dev/dl/go$GO_VERSION.linux-amd64.tar.gz \
    && tar -xf golang.tar.gz -C /usr/local \
    && rm -f golang.tar.gz \
    && microdnf update -y \
    && microdnf clean all -y \
    && mkdir -p "$GOPATH/src/kiali" "$GOPATH/bin"

COPY . $GOPATH/src/kiali

WORKDIR "$GOPATH/src/kiali"

# install packages now so we don't have to do it every time we start the container
# Set required permissions for OpenShift usage
RUN go mod download \
    && chgrp -R 0 $GOPATH \
    && chmod -R g=u $GOPATH

CMD ["/bin/bash", "-c", "tests/integration/run-tests.sh"]
